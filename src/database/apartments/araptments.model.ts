import { model } from "mongoose";
import {IApartmentDocument} from "./apartments.types";
import ApartmentSchema from "./apartments.schema";
export const ApartmentModel = model<IApartmentDocument>("apartment", ApartmentSchema);
