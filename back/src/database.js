import mongoose from "mongoose";

mongoose.set("strictQuery", false);

const uri = "mongodb+srv://prueba:prueba@cluster0.ybino9e.mongodb.net/test";

export const connectDb = async () => {
  try {
    const db = await mongoose.connect(uri);
    console.log("Base de datos conectada con exito", db.connection.name);
  } catch (error) {
    console.log(
      `Ha sucedido un error al conectar con la base de datos ${error.message}`
    );
  }
};
