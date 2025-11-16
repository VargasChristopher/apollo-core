import { Html, Head, Main, NextScript } from 'expo-router/html';
import appleTouchIcon from '@/assets/images/apple-touch-icon.png';
import favicon from '@/assets/images/favicon.png';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="apple-touch-icon" sizes="180x180" href={appleTouchIcon} />
        <link rel="icon" type="image/png" href={favicon} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
