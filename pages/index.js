import Head from 'next/head';
import Layout, { siteTitle } from '../components/layout';
import utilStyles from '../styles/utils.module.css';
import { queryDataSource } from '../lib/psy';
import { useRouter } from 'next/navigation'

export async function getStaticProps() {
  const allPsysData = await queryDataSource();
  return {
    props: {
      allPsysData,
    },
    revalidate: 5,
  };
}
export default function Home({ allPsysData }) {
  const router = useRouter()
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <div>咨询师</div>
        <ul className={utilStyles.list}>
          {
            allPsysData?.results?.map(psy => psy.properties?.status?.select?.name == "show" &&
              <li key={psy.id} className={utilStyles.listItem} onClick={() => router.push(`/psy/${psy.id}`)}>
                <div className={utilStyles.profileImg}>
                  <img src={psy.properties?.profile?.files?.[0]?.file?.url} alt="头像" />
                </div>
                <div className={utilStyles.content}>
                  <div className={utilStyles.contentTitle}>
                    <span className={utilStyles.name}>{psy.properties?.name?.title?.[0]?.plain_text}</span>
                    <span>
                      <span className={utilStyles.tags}>{
                        psy.properties?.psyTags?.multi_select?.map(tag => tag.name)?.join('/')
                      }</span>
                      <span className={utilStyles.price}>￥{psy.properties?.price?.number}</span>
                    </span>
                  </div>
                  <div className={utilStyles.contentIntor}>{psy.properties?.intor?.rich_text?.[0]?.plain_text}</div>
                </div>
              </li>)
          }
        </ul>
      </section>
    </Layout>
  );
}