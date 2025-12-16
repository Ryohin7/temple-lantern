// Simple toast implementation
export function toast({ title, description }: { title?: string, description?: string }) {
  alert(`${title ? title + '\n' : ''}${description || ''}`)
}







