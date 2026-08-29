import path from 'path'

/**
 * Handles file storage and returns public URL
 * Uploads directly to Cloudinary using unsigned upload preset.
 */
export async function uploadImage(
  fileBuffer: Buffer,
  fileName: string,
  folder: 'products' | 'partners' | 'slides' | 'logo' = 'products'
): Promise<string> {
  const fileExtension = path.extname(fileName)
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'kzmbkpoo'
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET || 'sat_saheb_uploads'
  
  try {
    // Convert buffer to base64 data URL
    const base64Data = fileBuffer.toString('base64')
    const mimeType = getMimeType(fileExtension)
    const fileDataUrl = `data:${mimeType};base64,${base64Data}`
    
    const formData = new FormData()
    formData.append('file', fileDataUrl)
    formData.append('upload_preset', uploadPreset)
    formData.append('folder', `sat-saheb-trading/${folder}`)

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData
    })
    
    const data = await res.json()
    if (!res.ok) {
      throw new Error(data.error?.message || 'Cloudinary upload failed')
    }
    
    return data.secure_url
  } catch (error) {
    console.error('Cloudinary upload failed:', error)
    throw error
  }
}

/**
 * Deletes an image from storage
 */
export async function deleteImage(imageUrl: string): Promise<boolean> {
  if (!imageUrl) return false

  // If Cloudinary URL
  if (imageUrl.includes('cloudinary.com')) {
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'kzmbkpoo'

    if (apiKey && apiSecret) {
      try {
        const decodedUrl = decodeURIComponent(imageUrl)
        const parts = decodedUrl.split('/image/upload/')
        if (parts.length > 1) {
          const pathParts = parts[1].split('/')
          // Remove version prefix if it matches v\d+
          if (pathParts[0].startsWith('v') && /^\d+$/.test(pathParts[0].substring(1))) {
            pathParts.shift()
          }
          const publicIdWithExt = pathParts.join('/')
          const publicId = publicIdWithExt.substring(0, publicIdWithExt.lastIndexOf('.'))

          // Generate SHA-1 signature
          const timestamp = Math.round(new Date().getTime() / 1000)
          const stringToSign = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`
          
          const crypto = await import('crypto')
          const signature = crypto.createHash('sha1').update(stringToSign).digest('hex')

          const formData = new FormData()
          formData.append('public_id', publicId)
          formData.append('timestamp', timestamp.toString())
          formData.append('api_key', apiKey)
          formData.append('signature', signature)

          const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
            method: 'POST',
            body: formData
          })
          
          const data = await res.json()
          return data.result === 'ok'
        }
      } catch (e) {
        console.error('Cloudinary asset deletion failed:', e)
      }
    } else {
      console.warn('Cloudinary deletion skipped: CLOUDINARY_API_KEY/SECRET not in environment')
    }
  }

  return false
}

// Helper to determine mime type
function getMimeType(ext: string): string {
  switch (ext.toLowerCase()) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg'
    case '.png':
      return 'image/png'
    case '.gif':
      return 'image/gif'
    case '.svg':
      return 'image/svg+xml'
    case '.webp':
      return 'image/webp'
    default:
      return 'application/octet-stream'
  }
}
