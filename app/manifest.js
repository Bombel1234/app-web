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
        src: '/assets/images/food.png',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: 'assets/images/DSC_0712.JPG',
        sizes: '192x192',
        type: 'image/png',
      },
    ],
  }
}
