import { Request, Response } from 'express';
import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import SignedUrlRepository from '../repositories/SignedUrlRepository';
import UserRepository from '../repositories/UserRepository';

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: "us-east-2",
  });

const s3 = new AWS.S3();

class SignedUrlController {

    async getSignedUrl(req: Request, res: Response) {
        const reqUser = req.user!;
        const fileExt = req.query.fileExt;

        const height = parseInt(req.query.height as string) ?? null;
        const width = parseInt(req.query.width as string) ?? null;

        const s3Params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: `${uuidv4()}.${fileExt}`,
            Expires: 600,
        };
        const signedUrl = s3.getSignedUrl("putObject", s3Params);
        const finalUrl = signedUrl.split("?")[0];

        const user = await UserRepository.findByUUID(reqUser.uuid);

        const signedUrlEntity = await SignedUrlRepository.create(finalUrl, user.id, height, width);
        return res.json({
            signedUrl,
            finalUrl,
            uuid: signedUrlEntity.uuid,
        })
    }



}

export default new SignedUrlController();
