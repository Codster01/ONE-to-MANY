import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class File extends Document {
    @Prop({required: true})
    fileName: string;

    @Prop({required:true})
    fileUrl: string;

    @Prop({required: true})
    extractedText: string;
}


export const FileSchema = SchemaFactory.createForClass(File);