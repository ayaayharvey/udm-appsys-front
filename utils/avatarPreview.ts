export function avatarPreview (image: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader;
        
        reader.onload = () => {
            const imagePreview = reader.result as string;
            resolve(imagePreview);
        }

        reader.onerror = () => {
            reject(new Error('Upload failed'));
        }

        reader.readAsDataURL(image);    
    })
}