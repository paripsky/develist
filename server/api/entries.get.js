import { serverSupabaseClient, serverSupabaseServiceRole } from '#supabase/server';

async function getEntriesFromSharedLink({ event, linkId }) {
  const client = serverSupabaseServiceRole(event);
  const { data: sharedLinks } = await client.from('share_links').select('user_id').eq('id', linkId);
  const [sharedLink] = sharedLinks ?? [];
  if (!sharedLink?.user_id) return [];

  const linkOwner = await client.auth.admin.getUserById(sharedLink.user_id);
  const owner = { name: linkOwner.data?.user?.user_metadata?.name };
  const { data: entries } = await client.from('entries').select('*').eq('user_id', sharedLink.user_id).order('title', { ascending: true });;

  return { entries, owner };
}

async function getEntries({ event }) {
  const client = await serverSupabaseClient(event);
  const { data: entries } = await client.from('entries').select('*').order('title', { ascending: true });

  return { entries };
}

// TODO: add search support? or just client for now
export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const linkId = query.link;
  const { entries, owner } = linkId ? await getEntriesFromSharedLink({ event, linkId }) : await getEntries({ event });

  return { entries, owner };
});
