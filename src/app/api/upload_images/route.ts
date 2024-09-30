import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

const UPLOAD_DIR = path.join(process.cwd(), 'public/uploads');
console.log(UPLOAD_DIR);

export const POST = async (req: NextRequest) => {
    const formData = await req.formData();
    const body = Object.fromEntries(formData.entries());
    console.log(body);
    const images = Object.values(body).filter((value) => value instanceof File);
    console.log(images);

    if (images && images.length > 0) {
        if (!fs.existsSync(UPLOAD_DIR)) {
            fs.mkdirSync(UPLOAD_DIR, { recursive: true });
        }

        const imageUrls = [];

        for (const image of images) {
            const buffer = Buffer.from(await image.arrayBuffer());
            const newFileName = `${Date.now()}-${image.name}`;
            fs.writeFileSync(path.resolve(UPLOAD_DIR, newFileName), buffer);
            imageUrls.push(`/uploads/${newFileName}`);
        }

        return NextResponse.json({
            success: true,
            urls: imageUrls,
        });
    } else {
        return NextResponse.json({
            success: false,
            message: 'No images uploaded',
        });
    }
};
