import { toast } from "@/components/ui/use-toast"
import type { ApiError } from "@/types"

export const handleApiError = (error: unknown, defaultMessage = 'An error occurred') => {
  let message = defaultMessage
  let details: string | undefined

  if (typeof error === 'string') {
    message = error
  } else if (error instanceof Error) {
    message = error.message
  } else if (error && typeof error === 'object' && 'message' in error) {
    message = String(error.message)
    
    if ('details' in error && error.details) {
      details = typeof error.details === 'string' 
        ? error.details 
        : JSON.stringify(error.details, null, 2)
    }
  }

  toast({
    title: 'Error',
    description: message,
    variant: 'destructive',
  })

  if (details) {
    console.error(details)
  }

  return { message, details }
}

export const handleApiSuccess = (message: string) => {
  toast({
    title: 'Success',
    description: message,
  })
}

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message)
  }
  return 'An unknown error occurred'
}
