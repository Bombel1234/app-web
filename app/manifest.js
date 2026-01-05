export default function manifest() {
  return {
    id:'/',
    name: 'App Web1',
    short_name: 'App Web1',
    description: 'Описание вашего PWA',
    start_url: '/app-web/',
    display: 'standalone',
    background_color: '#16d410ff',
    theme_color: '#fff',
    icons: [
      {
        src: '/assets/images/food-512.png',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: 'assets/images/food-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: 'assets/images/food-bg-180.png',
        sizes: '192x192',
        type: 'image/png',
      },
    ],
  }
}
