import * as postMapper from "../mapper/post.mapper.js";
import type { PostVO } from "../vo/post.vo.js";
import type { PostDTO } from "../dto/post.dto.js";


export async function getAllPosts(): Promise<PostVO[]> {
  return await postMapper.findAll();
}


export async function getPostById(id: number): Promise<PostVO | null> {
  return await postMapper.findById(id);
}


export async function createPost(dto: PostDTO): Promise<PostVO> {
  return await postMapper.create(dto);
}


export async function updatePost(
  id: number,
  dto: PostDTO
): Promise<PostVO | null> {
  return await postMapper.update(id, dto);
}


export async function deletePost(id: number): Promise<boolean> {
  return await postMapper.remove(id);
}