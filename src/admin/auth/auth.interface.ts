export interface AuthResponse {
    accessToken: string
    refreshToken: string
    admins?: {
        id: number
        email: string
        name: string
        role: number
        image_uri: string
    }
}
