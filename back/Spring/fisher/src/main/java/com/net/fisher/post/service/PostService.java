package com.net.fisher.post.service;

import com.net.fisher.exception.BusinessLogicException;
import com.net.fisher.exception.ExceptionCode;
import com.net.fisher.file.FileInfo;
import com.net.fisher.file.service.FileService;
import com.net.fisher.member.entity.Member;
import com.net.fisher.member.repository.MemberRepository;
import com.net.fisher.post.dto.LikeDto;
import com.net.fisher.post.dto.PostDto;
import com.net.fisher.post.entity.*;
import com.net.fisher.post.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class PostService {
    private final MemberRepository memberRepository;
    private final FileService fileService;
    private final PostRepository postRepository;
    private final PostImageRepository postImageRepository;
    private final LikeRepository likeRepository;
    private final TagRepository tagRepository;
    private final PostTagRepository postTagRepository;

    @Transactional
    public void uploadPost(long tokenId, Post post, List<Tag> tagList, MultipartHttpServletRequest httpServletRequest) {
        try {
            // member 조회
            Member member = memberRepository.findById(tokenId).orElseThrow(() -> new BusinessLogicException(ExceptionCode.MEMBER_NOT_FOUND));

            post.setMember(member);
            post = postRepository.save(post);

            // Tag 테이블에 등록, PostTag 에 등록
            PostTag postTag = null;
            for (Tag tagInfo : tagList) {
                Tag tag = tagRepository.findByTagName(tagInfo.getTagName()).orElse(
                        Tag.builder().tagName(tagInfo.getTagName()).build());
                tagRepository.save(tag);

                postTag = PostTag.builder()
                        .tag(tag)
                        .post(post)
                        .build();
                postTagRepository.save(postTag);
            }

            // 파일 업로드
            List<MultipartFile> fileList = httpServletRequest.getFiles("file");
            List<FileInfo> infoList = fileService.uploadFiles(fileList);

            PostImage postImage = null;
            for (FileInfo info : infoList) {
                postImage = PostImage.builder()
                        .fileName(info.getFileName())
                        .fileSize(info.getFileSize())
                        .fileContentType(info.getContentType())
                        .fileUrl(info.getFileUrl())
                        .post(post)
                        .build();

                postImageRepository.save(postImage);
            }

        } catch (BusinessLogicException e) {
            throw new BusinessLogicException(ExceptionCode.FAILED_TO_WRITE_BOARD);
        } catch (IOException e) {
            throw new BusinessLogicException(ExceptionCode.FAILED_TO_WRITE_BOARD);
        }

    }

    public Post postDetail(long postId) {

        Post post = postRepository.findById(postId).orElseThrow(() -> new BusinessLogicException(ExceptionCode.POST_NOT_FOUND));

        return post;
    }

    public List<PostImage> postImageDetail(long postId) {

        List<PostImage> postImages = postImageRepository.findPostImagesByPostId(postId);

        return postImages;
    }


    @Transactional
    public void increaseViews(long postId) {
        postRepository.upCountByPostId(postId);
    }

    @Transactional
    public void updatePost(long tokenId, long postId, PostDto.Patch postPatchDto) {

        Member member = memberRepository.findById(tokenId).orElseThrow(() -> new BusinessLogicException(ExceptionCode.MEMBER_NOT_FOUND));
        Post post = postRepository.findById(postId).orElseThrow(() -> new BusinessLogicException(ExceptionCode.POST_NOT_FOUND));

        if (member.getMemberId() != post.getMember().getMemberId()) {
            throw new BusinessLogicException(ExceptionCode.MEMBER_UNAUTHORIZED);
        }

        post.setContent(postPatchDto.getContent());
        postRepository.save(post);

        // 기존 태그와 비교해서 새로운 태그는 추가
        Set<Tag> tags = new HashSet<>(postTagRepository.findAllTagByPostId(postId));
        Set<Tag> newTags = new HashSet<>();
        for (Tag tag : postPatchDto.getTags()) {
            System.out.println("#############");
            System.out.println(tag);
            if (!tagRepository.existsTagByTagName(tag.getTagName())) {
                tag = tagRepository.save(tag);
                newTags.add(tag);
            } else {
                tag = tagRepository.findByTagName(tag.getTagName()).orElseThrow(() -> new BusinessLogicException(ExceptionCode.TAG_NOT_FOUNT));
                newTags.add(tag);
            }
        }

        // 공통 부분
//        tags.retainAll();
        Set<Tag> copyTags = Set.copyOf(tags);

        // PostTag 에서 지워줘야할 것
        tags.removeAll(newTags);
        tags.forEach((tag) -> postTagRepository.deleteByTagAndPost(tag, post));

        // PostTag 에 추가 해줘야 할 것
        newTags.removeAll(copyTags);
        System.out.println(newTags);
        PostTag postTag = null;
        for(Tag tag : newTags){
            postTag = PostTag.builder().tag(tag).post(post).build();
            postTagRepository.save(postTag);
        }

    }

    @Transactional
    public void deleteImage(long tokenId, long fileId) {

        Member member = memberRepository.findById(tokenId).orElseThrow(() -> new BusinessLogicException(ExceptionCode.MEMBER_NOT_FOUND));

        PostImage postImage = postImageRepository.findById(fileId).orElseThrow(() -> new BusinessLogicException(ExceptionCode.FILE_NOT_FOUND));

        if (member.getMemberId() != postImage.getPost().getMember().getMemberId()) {
            throw new BusinessLogicException(ExceptionCode.MEMBER_UNAUTHORIZED);
        }

        postImageRepository.delete(postImage);
    }

    @Transactional
    public void deletePost(long tokenId, long postId) {
        Member member = memberRepository.findById(tokenId).orElseThrow(() -> new BusinessLogicException(ExceptionCode.MEMBER_NOT_FOUND));
        Post post = postRepository.findById(postId).orElseThrow(() -> new BusinessLogicException(ExceptionCode.POST_NOT_FOUND));
        if (post.getMember().getMemberId() != member.getMemberId()) {
            throw new BusinessLogicException(ExceptionCode.MEMBER_UNAUTHORIZED);
        }

        List<PostImage> imageList = postImageRepository.findPostImagesByPostId(postId);
        postImageRepository.deleteAll(imageList);

        // 좋아요 삭제 - 좋아요 한사람이 여러명 있을 것
        List<Like> likeList = likeRepository.findAllByPostId(postId);
        likeRepository.deleteAll(likeList);

        // 태그 처리 필요
        List<PostTag> postTagList = postTagRepository.findAllByPost_PostId(postId);
        postTagRepository.deleteAll(postTagList);

        postRepository.delete(post);
    }

    @Transactional
    public void likePost(long tokenId, LikeDto.Post likePostDto) {

        Member member = memberRepository.findById(tokenId)
                .orElseThrow(() -> new BusinessLogicException(ExceptionCode.MEMBER_NOT_FOUND));

        Post post = postRepository.findById(likePostDto.getPostId())
                .orElseThrow(() -> new BusinessLogicException(ExceptionCode.POST_NOT_FOUND));

        // 이미 좋아요를 눌린 사람이 접근 한 경우
        Like like = likeRepository.findByMemberIdAndPostId(tokenId, likePostDto.getPostId())
                .orElse(Like.builder().post(post).member(member).build());

        likeRepository.save(like);
    }

    @Transactional
    public void unlikePost(long tokenId, LikeDto.Post likePostDto) {
        Like like = likeRepository.findByMemberIdAndPostId(tokenId, likePostDto.getPostId()).orElseThrow(() -> new BusinessLogicException(ExceptionCode.LIKE_NOT_FOUND));

        likeRepository.delete(like);
    }

    public long getLikeCount(long postId) {
        return likeRepository.countByPost_PostId(postId);
    }

    public List<Tag> getTags(long postId) {
        return postTagRepository.findAllTagByPostId(postId);
    }

    public List<Tag> getAllTags() {
        return tagRepository.findAll();
    }

    public List<Post> getMyAllPost(long tokenId){


        return null;
    }

    public Page<Post> getPostFromMember(long tokenId, Pageable pageable) {
        return postRepository.findPostByMemberIdFromPage(pageable, tokenId);
    }

    public PostImage getOnePostImageByPost(Post post){
        return postImageRepository.findFirstByPost(post);
    }

}
