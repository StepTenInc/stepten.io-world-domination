-- Create article_drafts table for autosave backups

CREATE TABLE IF NOT EXISTS public.article_drafts (
  draft_id TEXT PRIMARY KEY,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS article_drafts_updated_at_idx ON public.article_drafts(updated_at DESC);

CREATE TRIGGER update_article_drafts_updated_at
  BEFORE UPDATE ON public.article_drafts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE public.article_drafts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage drafts"
  ON public.article_drafts
  FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Service role has full access to drafts"
  ON public.article_drafts
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

GRANT ALL ON public.article_drafts TO authenticated;
