const sendMock = jest.fn();

process.env.AWS_REGION = 'us-east-1';
process.env.AWS_ACCESS_KEY = 'test';
process.env.AWS_SECRET_ACCESS_KEY = 'test';
process.env.S3_ENDPOINT = 'http://localstack:4566';
process.env.BUCKET_NAME = 'localstack-bucket';

import { createBucketIfNotExists, uploadImage } from '../../services/s3Service';

jest.mock('@aws-sdk/client-s3', () => {
  const originalModule = jest.requireActual('@aws-sdk/client-s3');
  return {
    ...originalModule,
    S3Client: jest.fn(() => ({
      send: sendMock,
    })),
    HeadBucketCommand: jest.fn().mockImplementation((args) => ({ ...args })),
    CreateBucketCommand: jest.fn().mockImplementation((args) => ({ ...args })),
    PutObjectCommand: jest.fn().mockImplementation((args) => ({ ...args })),
    HeadObjectCommand: jest.fn().mockImplementation((args) => ({ ...args })),
  };
});

describe('s3Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve criar bucket se não existir', async () => {
    sendMock.mockRejectedValueOnce({ $metadata: { httpStatusCode: 404 } });
    sendMock.mockResolvedValueOnce({});

    await expect(createBucketIfNotExists()).resolves.toBeUndefined();

    expect(sendMock).toHaveBeenCalledWith(expect.objectContaining({ Bucket: 'localstack-bucket' }));
    expect(sendMock).toHaveBeenCalledTimes(2);
  });

  it('deve fazer upload da imagem com sucesso', async () => {
    sendMock.mockResolvedValueOnce({});

    const file = {
      originalname: 'image.png',
      mimetype: 'image/png',
      buffer: Buffer.from('fake-image'),
    };

    const url = await uploadImage(file, 'avatars');

    expect(sendMock).toHaveBeenCalledWith(expect.objectContaining({
      Bucket: 'localstack-bucket',
      Key: 'avatars/image.png',
    }));
    expect(url).toBe('http://localstack:4566/localstack-bucket/avatars/image.png');
  });
});
