export const productImages: Record<string, string> = {
  'yakisoba-frango': 'https://images.unsplash.com/photo-1674516585458-3704727660a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5YWtpc29iYSUyMGNoaWNrZW4lMjBhc2lhbiUyMGZvb2R8ZW58MXx8fHwxNzczMjgwNTQ4fDA&ixlib=rb-4.1.0&q=80&w=1080',
  'x-burguer-katsu': 'https://images.unsplash.com/photo-1658822118306-8ee34f118600?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVlc2VidXJnZXIlMjBkZWxpY2lvdXN8ZW58MXx8fHwxNzczMjQxMTE3fDA&ixlib=rb-4.1.0&q=80&w=1080',
  'pink-drink': 'https://images.unsplash.com/photo-1766589140074-2eaf61164763?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaW5rJTIwYmVycnklMjBkcmluayUyMGNvY2t0YWlsfGVufDF8fHx8MTc3MzI4MDU1MHww&ixlib=rb-4.1.0&q=80&w=1080',
  'sunomono': 'https://images.unsplash.com/photo-1766762462673-85a4dbfff363?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdWN1bWJlciUyMHNhbGFkJTIwamFwYW5lc2V8ZW58MXx8fHwxNzczMjgwNTUwfDA&ixlib=rb-4.1.0&q=80&w=1080',
  'salmao-grelhado': 'https://images.unsplash.com/photo-1557499305-0af888c3d8ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwc2FsbW9uJTIwcGxhdGV8ZW58MXx8fHwxNzczMjgwNTUwfDA&ixlib=rb-4.1.0&q=80&w=1080',
  'joy-roll': 'https://images.unsplash.com/photo-1712725213572-443fe866a69a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXNoaSUyMHJvbGwlMjBqYXBhbmVzZXxlbnwxfHx8fDE3NzMyNjY4ODh8MA&ixlib=rb-4.1.0&q=80&w=1080',
};

export function getProductImage(imageKey: string): string {
  return productImages[imageKey] || productImages['yakisoba-frango'];
}
