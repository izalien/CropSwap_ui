import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '@/components/Header';

export default function HomeScreen() {
  return (
    <html lang='en'>
      <head>
        <title>Home - Crop Swap</title>
        <meta name="description" content="Manage crop history and rotation." />
      </head>
      <body data-bs-theme="dark">
        <Header />
        <h1 className='display-1 m-5 text-center'>Welcome to Crop Swap</h1>
        <p className='text-center'>This program is intended to assist farmers in crop planning and rotation.</p>
      </body>
    </html>
  );
}