"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  TextField,
  Typography,
  Chip,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "@/i18n/navigation";
import Header from "@/app/_components/Header";

export default function PostEditorPage({ editId }: { editId?: string }) {
  const router = useRouter();
  const isEdit = !!editId;

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!editId) return;
    fetch(`/api/posts/${editId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          const p = data.post;
          setTitle(p.title);
          setSlug(p.slug);
          setExcerpt(p.excerpt || "");
          setContent(p.content);
          setTags(p.tags || []);
        }
      })
      .finally(() => setFetching(false));
  }, [editId]);

  const handleAddTag = () => {
    const tag = tagsInput.trim();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
    }
    setTagsInput("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const endpoint = isEdit ? `/api/posts/${editId}` : "/api/posts";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, slug, excerpt, content, tags }),
    });

    const data = await res.json();
    setLoading(false);

    if (!data.success) {
      setError(data.message);
    } else {
      router.push("/dashboard");
    }
  };

  if (fetching) {
    return (
      <>
        <Header />
        <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
          <CircularProgress />
        </Box>
      </>
    );
  }

  return (
    <>
      <Header />
      <Box sx={{ maxWidth: 900, mx: "auto", px: 3, py: 4, flex: 1 }}>
        {/* 顶部返回栏 */}
        <Button
          startIcon={<ArrowBack />}
          onClick={() => router.push("/dashboard")}
          sx={{ mb: 3, textTransform: "none" }}
        >
          返回创作中心
        </Button>

        <Card sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 4 }}>
              {isEdit ? "编辑文章" : "新建文章"}
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="标题"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                sx={{ mb: 2.5 }}
                required
              />

              <TextField
                fullWidth
                label="Slug"
                placeholder="my-article-slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                sx={{ mb: 2.5 }}
                required
                helperText="URL 路径标识，例如 my-first-post"
              />

              <TextField
                fullWidth
                label="摘要"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                sx={{ mb: 2.5 }}
                multiline
                rows={2}
              />

              <TextField
                fullWidth
                label="内容 (Markdown)"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                sx={{ mb: 2.5 }}
                multiline
                rows={18}
                required
              />

              {/* 标签 */}
              <Box sx={{ display: "flex", gap: 1, mb: 1.5 }}>
                <TextField
                  label="添加标签"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  size="small"
                  sx={{ width: 200 }}
                />
                <Button variant="outlined" onClick={handleAddTag} size="small">
                  添加
                </Button>
              </Box>
              <Box sx={{ display: "flex", gap: 1, mb: 3, flexWrap: "wrap" }}>
                {tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => setTags(tags.filter((t) => t !== tag))}
                  />
                ))}
              </Box>

              {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                  {error}
                </Typography>
              )}

              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  size="large"
                  sx={{ borderRadius: 1.5, px: 4 }}
                >
                  {loading ? <CircularProgress size={20} /> : isEdit ? "保存修改" : "发布文章"}
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => router.push("/dashboard")}
                  sx={{ borderRadius: 1.5 }}
                >
                  取消
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}
