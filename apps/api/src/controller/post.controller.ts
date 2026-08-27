import type { Request, Response } from "express";
import * as postService from "../service/post.service.js";
import type { PostDTO } from "../dto/post.dto.js";


export async function getAllPosts(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const posts = await postService.getAllPosts();

    res.json(posts);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "게시글 목록 조회에 실패했습니다.",
    });
  }
}


export async function getPostById(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      res.status(400).json({
        message: "잘못된 게시글 번호입니다.",
      });
      return;
    }

    const post = await postService.getPostById(id);

    if (!post) {
      res.status(404).json({
        message: "게시글을 찾을 수 없습니다.",
      });
      return;
    }

    res.json(post);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "게시글 조회에 실패했습니다.",
    });
  }
}


export async function createPost(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const dto: PostDTO = req.body;

    if (!dto.title?.trim() || !dto.content?.trim()) {
      res.status(400).json({
        message: "제목과 내용을 입력해주세요.",
      });
      return;
    }

    const post = await postService.createPost(dto);

    res.status(201).json(post);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "게시글 등록에 실패했습니다.",
    });
  }
}


export async function updatePost(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const id = Number(req.params.id);
    const dto: PostDTO = req.body;

    if (Number.isNaN(id)) {
      res.status(400).json({
        message: "잘못된 게시글 번호입니다.",
      });
      return;
    }

    if (!dto.title?.trim() || !dto.content?.trim()) {
      res.status(400).json({
        message: "제목과 내용을 입력해주세요.",
      });
      return;
    }

    const post = await postService.updatePost(id, dto);

    if (!post) {
      res.status(404).json({
        message: "게시글을 찾을 수 없습니다.",
      });
      return;
    }

    res.json(post);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "게시글 수정에 실패했습니다.",
    });
  }
}


export async function deletePost(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      res.status(400).json({
        message: "잘못된 게시글 번호입니다.",
      });
      return;
    }

    const deleted = await postService.deletePost(id);

    if (!deleted) {
      res.status(404).json({
        message: "게시글을 찾을 수 없습니다.",
      });
      return;
    }

    res.json({
      message: "게시글이 삭제되었습니다.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "게시글 삭제에 실패했습니다.",
    });
  }
}