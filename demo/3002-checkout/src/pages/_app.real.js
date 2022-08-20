import {useEffect, useState} from 'react';
import App from 'next/app';
import dynamic from 'next/dynamic';
import {Layout, version} from 'antd';
import AppMenu from './_menu';

const SharedNav = dynamic(
  () => {
    const mod = import('home/SharedNav').catch(console.error);
    return mod;
  },
  {ssr: false}
);

function MyApp({Component, pageProps}) {
  const [MenuComponent, setMenuComponent] = useState(() => AppMenu);
  useEffect(() => {
    const cb = ({detail}) => {
      if (detail && detail !== MenuComponent) setMenuComponent(() => detail);
    };
    window.addEventListener('federated-menu', cb);
    return () => {
      window.removeEventListener('federated-menu', cb);
    };
  }, []);

  return (
    <Layout style={{minHeight: '100vh'}}>
      <SharedNav />
      <Layout>
        <Layout.Sider width={200}>
          <MenuComponent />
        </Layout.Sider>
        <Layout>
          <Layout.Content style={{background: '#fff', padding: 20}}>
            <Component {...pageProps} />
          </Layout.Content>
          <Layout.Footer
            style={{background: '#fff', color: '#999', textAlign: 'center'}}
          >
            antd@{version}
          </Layout.Footer>
        </Layout>
      </Layout>
    </Layout>
  );
}

MyApp.getInitialProps = async (ctx) => {
  const appProps = await App.getInitialProps(ctx);
  return appProps;
};

export default MyApp;