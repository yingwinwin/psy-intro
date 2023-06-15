import Layout from '../../components/layout';
import Head from 'next/head';
import { getAllPsyIds, getPsyPage } from '../../lib/psy';
import utilStyles from '../../styles/utils.module.css';
import React from 'react';


export async function getStaticProps({ params }) {
    const psyData = await getPsyPage(params.id);
    return {
        props: {
            psyData,
        },
    };
}
export async function getStaticPaths() {
    const paths = await getAllPsyIds();
    return {
        paths,
        fallback: false,
    };
}
export default function Post({ psyData }) {

    const handleBlocks = (block) => {
        if (block.quote) {
            const quote = block.quote.rich_text[0].plain_text;
            return <Quote key={block.id} quote={quote} pages={psyData.pages.properties} />
        }

        if (block.heading_2) {
            const heading_2 = block.heading_2.rich_text[0].plain_text;
            return <Heading>{heading_2}</Heading>
        }

        if (block.table) {
            const columns = psyData.tables[block.id].results.map(table => table.table_row.cells).map(cell => cell.map(c => c[0] || {}));
            const table = [];
            const texts = columns.map(col => col.map(c => c.plain_text))
            for (let i = 1; i < texts.length; i++) {
                let obj = {}
                for (let j = 0; j < texts[0].length; j++) {
                    obj[texts[0][j]] = texts[i][j]
                }
                table.push(obj)
            }
            return <Table data={table} />
        }
        return null
    }
    return (
        <Layout>
            <Head>
                <title>{psyData?.pages?.properties?.name?.title?.[0]?.plain_text}</title>
            </Head>
            <div className={utilStyles.detailContent}>
                {
                    psyData.blocks.results.map((block) => <React.Fragment key={block.id}>{handleBlocks(block)}</React.Fragment>)
                }
            </div>
        </Layout>
    );
}

const Quote = ({ quote, pages }) => {
    return <div style={{ borderBottom: '1px solid #eaeaea' }}>
        <div className={utilStyles.quote}>{quote}</div>
        <div style={{ display: 'flex' }}>
            <span className={utilStyles.price}>{pages.price.number}元</span>
            <span className={utilStyles.time}>/50分钟</span>
        </div>
        <div className={utilStyles.tags}>{pages.psyTags.multi_select.map(tag => tag.name).join('/')}</div>
    </div>
}

const Heading = ({
    children
}) => {
    return <div className={utilStyles.title} >{children}</div>
}

const Table = ({ data }) => {
    if (data[0].other_title) {
        return data.map((d, i) => <div key={d.intor} className={utilStyles.intor} >
            <div>从业{d.work_time}</div>
            {
                [{
                    time: d.personal_time,
                    title: '个案咨询小时数'
                }, {
                    time: d.team_time,
                    title: '团体咨询小时数'
                }].filter(f => f.time).map(item =>
                    <div className={utilStyles.card}>
                        <span>{item.time}</span>
                        <span className={utilStyles.cardText}>{item.title}</span>
                    </div>)
            }
            <pre>{d.other_title}</pre>
            <div>{d.intor}</div>
        </div>)
    }

    if (data[0].direction) {
        return <div className={utilStyles.intor}>
            {
                data.map((d, i) => <React.Fragment key={d.direction}>
                    <div className={utilStyles.direction}>{d.direction}</div>
                    <pre>{d.description}</pre>
                </React.Fragment>)
            }
        </div>
    }


    if (data[0].training_mode) {
        return <div className={utilStyles.intor}>
            {
                data.map((d, i) => <React.Fragment key={d.training_mode}>
                    <div className={utilStyles.direction}>{d.training_mode}</div>
                    <pre>{d.content}</pre>
                </React.Fragment>)
            }
        </div>
    }
    return null;
}