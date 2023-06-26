import { serverSupabaseClient, serverSupabaseServiceRole } from '#supabase/server';

async function getEntriesFromSharedLink({ event, linkId }) {
  const client = serverSupabaseServiceRole(event);
  const { data: sharedLinks } = await client.from('share_links').select('user_id').eq('id', linkId);
  const [sharedLink] = sharedLinks ?? [];
  if (!sharedLink?.user_id) return [];

  const { data: entries } = await client.from('entries').select('*').eq('user_id', sharedLink.user_id);

  return entries;
}

async function getEntries({ event }) {
  const client = serverSupabaseClient(event);
  const { data: entries } = await client.from('entries').select('*');

  return entries;
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const linkId = query.link;
  const entries = linkId ? await getEntriesFromSharedLink({ event, linkId }) : await getEntries({ event });

  return entries;
});
