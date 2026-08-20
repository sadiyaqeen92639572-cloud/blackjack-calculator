import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 14,
          background: '#06170f',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: 54,
            height: 54,
            borderRadius: '50%',
            background: '#2fae60',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#06170f',
            fontSize: 24,
            fontWeight: 800,
            fontFamily: 'Arial, Helvetica, sans-serif',
          }}
        >
          21
        </div>
      </div>
    ),
    { ...size }
  );
}
