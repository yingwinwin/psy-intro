import { Client } from "@notionhq/client"

const notion = new Client({ auth: process.env.NOTION_KEY })

const databaseId = process.env.NOTION_DATABASE_ID
export async function queryDataSource() {
  try {
    const response = await notion.databases.query({
      database_id: databaseId
    })
    return response
  } catch (error) {
    return error.body
  }
}

export async function getAllPsyIds() {
  const response = await notion.databases.query({
    database_id: databaseId
  })
  return response?.results?.map(res => {
    return {
      params: {
        id: res.id,
      },
    };
  })
}
export async function getPsyPage(id) {
  const blocks = await notion.blocks.children.list({
    block_id: id,
    page_size: 50,
  });
  const pages = await notion.pages.retrieve({
    page_id: id,
  });
  let tables = {}
  for (const element of blocks.results) {
    if (element.table) {
      const blocksTable = await notion.blocks.children.list({
        block_id: element.id,
        page_size: 50,
      });
      tables[element.id] = blocksTable
    }
  }

  return {
    id,
    blocks,
    pages,
    tables
  }
}