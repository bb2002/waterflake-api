export default interface KakaoLoginResult {
  id?: string | null;
  kakaoAccount?: {
    email?: string | null;
    name?: string | null;
    profile?: {
      profile_image_url?: string | null;
    };
  };
}
