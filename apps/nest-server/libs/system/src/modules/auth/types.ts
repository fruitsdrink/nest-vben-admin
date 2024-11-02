/**
 * 生成token的选项
 */
export type GenerateTokenOptions = {
  /**
   * 用户id
   */
  userId: string;
  /**
   * Jwt配置
   */
  jwt: {
    /**
     * 密钥
     */
    secret: string;
    /**
     * 刷新密钥
     */
    refreshSecret: string;
    /**
     * 过期时间
     */
    expiresIn: string;
    /**
     * 刷新过期时间
     */
    refreshExpiresIn: string;
    /**
     * 过期时间（毫秒）
     */
    expiresInMilliseconds: number;
    /**
     * 刷新过期时间（毫秒）
     */
    refreshExpiresInMilliseconds: number;
    /**
     * 是否启用cookie安全
     */
    cookieSecure: boolean;
  };
};

/**
 * 生成token结果
 */
export type GenerateTokenResult = {
  /**
   * jwt令牌
   */
  accessToken: string;
  /**
   * jwt过期时间
   */
  expiresIn: Date;
  /**
   * jwt刷新令牌
   */
  refreshToken: string;
  /**
   * jwt刷新过期时间
   */
  refreshExpiresIn: Date;
  /**
   * 是否启用cookie安全
   */
  cookieSecure: boolean;
};
