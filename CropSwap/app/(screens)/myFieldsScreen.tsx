import { Header } from "react-native/Libraries/NewAppScreen";

export default function MyFieldsScreen() {
    return (
        <html lang='en'>
            <head>
                <title>My Fields - Crop Swap</title>
                <meta name="description" content="Manage your current fields and crops." />
            </head>
            <body data-bs-theme="dark">
                <Header />
                <h2 className='display-2 m-5'>My Fields</h2>
                <p className='text-center'>This is where you can manage your fields and crops.</p>
            </body>
        </html>
    );
}