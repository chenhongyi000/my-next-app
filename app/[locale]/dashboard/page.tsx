"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { useRouter } from "@/i18n/navigation";
import Header from "@/app/_components/Header";

interface Post {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  tags: string[];
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchPosts = async () => {
    const res = await fetch("/api/posts");
    const data = await res.json();
    if (data.success) setPosts(data.posts);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    await fetch(`/api/posts/${deleteId}`, { method: "DELETE" });
    setDeleteId(null);
    fetchPosts();
  };

  if (loading) {
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
      <Box sx={{ maxWidth: 1100, mx: "auto", px: 3, py: 4, flex: 1 }}>
        {/* 顶部标题栏 */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              创作中心
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              管理你的文章，共 {posts.length} 篇
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="large"
            startIcon={<Add />}
            onClick={() => router.push("/dashboard/posts/new")}
            sx={{ borderRadius: 1.5, px: 3 }}
          >
            新建文章
          </Button>
        </Box>

        {posts.length === 0 ? (
          <Card sx={{ borderRadius: 3, py: 8, textAlign: "center" }}>
            <Typography color="text.secondary" variant="h6">
              还没有文章
            </Typography>
            <Typography color="text.secondary" variant="body2" sx={{ mt: 1 }}>
              点击「新建文章」开始你的第一次创作
            </Typography>
          </Card>
        ) : (
          <Grid container spacing={2.5}>
            {posts.map((post) => (
              <Grid key={post._id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card
                  sx={{
                    borderRadius: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    transition: "box-shadow 0.2s",
                    "&:hover": { boxShadow: 4 },
                  }}
                >
                  <CardActionArea
                    onClick={() => router.push(`/dashboard/posts/${post._id}/edit`)}
                    sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "stretch" }}
                  >
                    <CardContent sx={{ flex: 1, pb: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, lineClamp: 2 }}>
                        {post.title}
                      </Typography>
                      <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mb: 1 }}>
                        {post.tags.slice(0, 3).map((tag) => (
                          <Chip key={tag} label={tag} size="small" variant="outlined" />
                        ))}
                        {post.tags.length > 3 && (
                          <Chip label={`+${post.tags.length - 3}`} size="small" />
                        )}
                      </Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          lineClamp: 2,
                          minHeight: 40,
                          fontSize: "0.875rem",
                          mb: 0.5,
                        }}
                      >
                        {post.excerpt || "暂无摘要"}
                      </Typography>
                    </CardContent>
                  </CardActionArea>

                  {/* 底部操作栏 */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      px: 2,
                      pb: 2,
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      {new Date(post.createdAt).toLocaleDateString("zh-CN")}
                    </Typography>
                    <Box sx={{ display: "flex" }}>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/dashboard/posts/${post._id}/edit`);
                        }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteId(post._id);
                        }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* 删除确认弹窗 */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>确认删除</DialogTitle>
        <DialogContent>
          <DialogContentText>删除后无法恢复，确定要删除这篇文章吗？</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>取消</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            删除
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
