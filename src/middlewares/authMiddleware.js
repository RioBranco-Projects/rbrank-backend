import jwt from "jsonwebtoken";
import Professor from "../models/Professor.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.professor = await Professor.findById(decoded.id).select("-senha");
      next();
    } catch (error) {
      res.status(401).json({ message: "Token inválido" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Acesso negado, token não fornecido" });
  }
};
