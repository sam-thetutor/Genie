const mongoose = require('mongoose');
const { OpenAI } = require('@langchain/openai');
const { MongoClient } = require('mongodb');
const { MongoDBAtlasVectorSearch } = require('@langchain/mongodb');
const { PDFLoader } = require("langchain/document_loaders/fs/pdf");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const fs = require('fs').promises;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const uri = process.env.VITE_MONGODB_ATLAS_URI;
const client = new MongoClient(uri);




const saveChatInstance = async (req, res) => {
  try {
    await client.connect();
    const db = client.db(process.env.VITE_MONGODB_ATLAS_DB_NAME);
    const instances = db.collection("instances");

    const newInstance = {
      name: req.body.name || `Chat Instance ${Date.now()}`,
      createdAt: new Date(),
      documentName: null,
    };

    const result = await instances.insertOne(newInstance);
    res.json({ success: true, instanceId: result.insertedId });



  } catch (error) {
    res.status(500).json({ message: 'Error saving chat instance' });
  }
};

const getAllInstances = async (req, res) => {
    try {
        await client.connect();
        const db = client.db(process.env.VITE_MONGODB_ATLAS_DB_NAME);
        const instances = db.collection("instances");
        const allInstances = await instances.find({}).toArray();
        res.json({ success: true, instances: allInstances });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching chat instances' });
    }
};


const getChatInstance = async (req, res) => {
    try {
        console.log("params", req.params)
        await client.connect();
        const db = client.db(process.env.VITE_MONGODB_ATLAS_DB_NAME);
        const instances = db.collection("instances");
    
        const instance = await instances.findOne({
          _id: new ObjectId(req.params.id),
        });
        if (!instance) {
          return res
            .status(404)
            .json({ success: false, error: "Instance not found" });
        }
    
        res.json({ success: true, instance });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching chat instance',error: error });
    }
};

    const deleteChatInstance = async (req, res) => {
    try {
        // Check if the ID is valid
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
          return res.status(400).json({ 
            success: false, 
            message: 'Invalid instance ID format' 
          });
        }
    
        await client.connect();
        const db = client.db(process.env.VITE_MONGODB_ATLAS_DB_NAME);
        const instances = db.collection("instances");
        const chatHistory = db.collection("chatHistory");
        const vectorStore = db.collection("vectorStore");
    
        const ObjectId = require('mongodb').ObjectId;
        const instanceId = new ObjectId(req.params.id);
    
        // Delete the instance
        const deleteResult = await instances.deleteOne({ _id: instanceId });
    
        if (deleteResult.deletedCount === 0) {
          return res.status(404).json({ 
            success: false, 
            message: 'Instance not found' 
          });
        }
    
        // Delete related data
        await chatHistory.deleteMany({ instanceId: req.params.id });
        await vectorStore.deleteMany({ instanceId: req.params.id });
    
        res.json({ success: true, message: "Instance deleted successfully" });
    } catch (error) {
        console.error('Error in deleteChatInstance:', error);
        res.status(500).json({ 
          message: 'Error deleting chat instance', 
          error: error.message 
        });
    } finally {
        await client.close();
    }
};

const uploadAIFile = async (req, res) => {
    try {
        if (!req.file) {
          throw new Error("No file uploaded");
        }
  
        // Use PDFLoader to load and parse the PDF
        const loader = new PDFLoader(req.file.path);
        const docs = await loader.load();
  
        const textSplitter = new RecursiveCharacterTextSplitter({
          chunkSize: 500,
          separator: ["\n\n", "\n", ""],
          chunkOverlap: 50,
        });
  
        const documents = await textSplitter.splitDocuments(docs);
  
        await client.connect();
        const collection = client
          .db(process.env.VITE_MONGODB_ATLAS_DB_NAME)
          .collection("vectorStore");
  
        console.log(process.env.VITE_OPENAI_API_KEY);
        const embeddings = new OpenAIEmbeddings({
          modelName: "text-embedding-3-small",
          openAIApiKey: process.env.VITE_OPENAI_API_KEY,
        });
  
        const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
          collection: collection,
          indexName: "vector_index",
          textKey: "text",
          embeddingKey: "embedding",
          filterKey: "metadata.instanceId",
        });
  
        // Add instanceId to each document
        const documentsWithInstance = documents.map((doc) => {
          console.log("Processing document:", {
            originalMetadata: doc.metadata,
            pageContent: doc.pageContent.substring(0, 100) + "...",
          });
  
          return {
            ...doc,
            metadata: {
              ...doc.metadata,
              instanceId: req.params.id,
            },
          };
        });
  
        await vectorStore.addDocuments(documentsWithInstance);
        console.log("Added documents:", {
          count: documentsWithInstance.length,
          sampleDoc: documentsWithInstance[0],
          instanceId: req.params.id,
        });
  
        // Update instance with document name
        const instances = client
          .db(process.env.VITE_MONGODB_ATLAS_DB_NAME)
          .collection("instances");
  
        await instances.updateOne(
          { _id: new ObjectId(req.params.id) },
          { $set: { documentName: req.file.originalname } }
        );
  
        // Clean up the uploaded file
        await fs.unlink(req.file.path);
  
        res.json({ success: true });
      } catch (error) {
        // Clean up the uploaded file in case of error
        if (req.file) {
          try {
            await fs.unlink(req.file.path);
          } catch (unlinkError) {
            console.error("Error deleting file:", unlinkError);
          }
        }
        console.error("Error processing PDF:", error);
        res.status(500).json({ success: false, error: error.message });
      }
};

module.exports = {
  saveChatInstance,
  getAllInstances,
  getChatInstance,
  deleteChatInstance,
  uploadAIFile
};




