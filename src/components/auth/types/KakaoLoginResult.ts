export interface KakaoLoginResult {
  id: number;
  connected_at: string;
  properties: Properties;
  kakao_account: KakaoAccount;
}

export interface Properties {
  nickname: string;
  profile_image: string;
  thumbnail_image: string;
}

export interface KakaoAccount {
  profile_nickname_needs_agreement: boolean;
  profile_image_needs_agreement: boolean;
  profile: Profile;
  has_email: boolean;
  email_needs_agreement: boolean;
  is_email_valid: boolean;
  is_email_verified: boolean;
  email: string;
}

export interface Profile {
  nickname: string;
  thumbnail_image_url: string;
  profile_image_url: string;
  is_default_image: boolean;
}
