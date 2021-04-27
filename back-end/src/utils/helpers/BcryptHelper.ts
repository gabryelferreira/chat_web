import * as bcrypt from 'bcryptjs';

class BcryptHelper {

    async hash(password: string): Promise<string> {
        return new Promise((resolve, reject) => {
            bcrypt.hash(password, 10, (err: Error, hash: string) => {
                if (err) reject(err);
                else resolve(hash);
            })
        })
    }

    async compare(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash);
    }

}

export default new BcryptHelper();
