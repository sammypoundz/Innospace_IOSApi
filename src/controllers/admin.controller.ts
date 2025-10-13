import { Request, Response } from "express";
import { Intern } from "../models/intern.model";
import { sendResponse } from "../utils/response";

export const getAllInterns = async (req: Request, res: Response) => {
  const { page = 1, limit = 10 } = req.query;
  const interns = await Intern.find()
    .skip((+page - 1) * +limit)
    .limit(+limit);
  const count = await Intern.countDocuments();
  return sendResponse(res, 200, true, "All interns fetched", { interns, count });
};

export const getSiwes = async (_req: Request, res: Response) => {
  const data = await Intern.find({ category: "SIWES" });
  return sendResponse(res, 200, true, "SIWES students fetched", data);
};

export const getInterns = async (_req: Request, res: Response) => {
  const data = await Intern.find({ category: "Intern" });
  return sendResponse(res, 200, true, "Interns fetched", data);
};

export const uploadAcceptance = async (req: Request, res: Response) => {
  const { id } = req.params;
  const acceptanceLetter = (req.file as any)?.path;
  const intern = await Intern.findByIdAndUpdate(id, { acceptanceLetter }, { new: true });
  return sendResponse(res, 200, true, "Acceptance letter uploaded", intern);
};

export const uploadCertificate = async (req: Request, res: Response) => {
  const { id } = req.params;
  const certificate = (req.file as any)?.path;
  const intern = await Intern.findByIdAndUpdate(id, { certificate }, { new: true });
  return sendResponse(res, 200, true, "Certificate uploaded", intern);
};

export const acceptIntern = async (req: Request, res: Response) => {
  const { id } = req.params;
  const intern = await Intern.findByIdAndUpdate(id, { status: "Accepted" }, { new: true });
  return sendResponse(res, 200, true, "Intern accepted", intern);
};

export const deleteIntern = async (req: Request, res: Response) => {
  const { id } = req.params;
  await Intern.findByIdAndDelete(id);
  return sendResponse(res, 200, true, "Intern deleted");
};

export const createManualIntern = async (req: Request, res: Response) => {
  const { name, phone, email, school, category } = req.body;
  const intern = new Intern({ name, phone, email, school, category });
  await intern.save();
  return sendResponse(res, 201, true, "Intern created manually", intern);
};
