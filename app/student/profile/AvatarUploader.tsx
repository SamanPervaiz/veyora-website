"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface AvatarUploaderProps {
  userId: string;
  currentAvatar: string | null;
}

export default function AvatarUploader({
  userId,
  currentAvatar,
}: AvatarUploaderProps) {
  const supabase = createClient();

  const inputRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState<string | null>(
    currentAvatar
  );

  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const choosePhoto = () => {
    inputRef.current?.click();
  };

  const handleChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setMessage("");

    if (!file.type.startsWith("image/")) {
      setMessage("Please select an image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage("Image must be smaller than 5MB.");
      return;
    }

    const localUrl = URL.createObjectURL(file);

    setPreview(localUrl);
    setUploading(true);

    try {
      const extension =
        file.name.split(".").pop()?.toLowerCase() || "jpg";

      const filePath = `${userId}/avatar.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
          upsert: true,
          contentType: file.type,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const avatarUrl = `${data.publicUrl}?v=${Date.now()}`;

      const { error: updateError } = await supabase
        .from("students")
        .update({
          avatar_url: avatarUrl,
        })
        .eq("id", userId);

      if (updateError) {
        throw updateError;
      }

      setPreview(avatarUrl);
      setMessage("Profile photo updated successfully.");
    } catch (error) {
      console.error("Avatar upload error:", error);

      setPreview(currentAvatar);

      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to upload photo."
      );
    } finally {
      setUploading(false);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  return (
    <div className="avatarBox">
      <div className="visualArea">
        <div className="glow" />

        <div className="avatarCircle">
          {preview ? (
            <img
              src={preview}
              alt="Student profile"
            />
          ) : (
            <span>+</span>
          )}
        </div>

        <button
          type="button"
          onClick={choosePhoto}
          className="editButton"
          disabled={uploading}
          aria-label="Change profile photo"
        >
          {uploading ? "..." : "✦"}
        </button>
      </div>

      <div className="content">
        <div className="label">
          PROFILE IMAGE
        </div>

        <h3>
          Make your learning space yours.
        </h3>

        <p>
          Add a profile photo so your Veyora student space feels
          personal and recognizable.
        </p>

        <button
          type="button"
          onClick={choosePhoto}
          className="chooseButton"
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Choose Photo"}
          <span>↗</span>
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleChange}
          hidden
        />

        {message && (
          <div className="message">
            {message}
          </div>
        )}
      </div>

      <style jsx>{`
        .avatarBox {
          position: relative;
          display: flex;
          align-items: center;
          gap: 28px;
          padding: 24px;
          border: 1px solid #292f3a;
          border-radius: 22px;
          background:
            radial-gradient(
              circle at 12% 50%,
              rgba(255, 155, 77, 0.08),
              transparent 34%
            ),
            #0d1016;
          overflow: hidden;
        }

        .avatarBox::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(
            110deg,
            transparent 30%,
            rgba(255, 255, 255, 0.025) 50%,
            transparent 70%
          );
          transform: translateX(-100%);
          animation: sweep 5s ease-in-out infinite;
        }

        @keyframes sweep {
          0%,
          65%,
          100% {
            transform: translateX(-100%);
          }

          80% {
            transform: translateX(100%);
          }
        }

        .visualArea {
          position: relative;
          width: 126px;
          height: 126px;
          flex: 0 0 126px;
          display: grid;
          place-items: center;
        }

        .glow {
          position: absolute;
          inset: -8px;
          border-radius: 50%;
          background: conic-gradient(
            from 0deg,
            transparent 0deg,
            #ff9b4d 80deg,
            transparent 150deg,
            #6e7cf6 235deg,
            transparent 320deg
          );
          filter: blur(12px);
          opacity: 0.45;
          animation: rotateGlow 8s linear infinite;
        }

        @keyframes rotateGlow {
          to {
            transform: rotate(360deg);
          }
        }

        .avatarCircle {
          position: relative;
          z-index: 2;
          width: 108px;
          height: 108px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          overflow: hidden;
          background: #12151c;
          border: 2px solid #333946;
          box-shadow:
            0 0 35px rgba(255, 155, 77, 0.08),
            inset 0 0 25px rgba(255, 255, 255, 0.02);
        }

        .avatarCircle img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .avatarCircle span {
          color: #ff9b4d;
          font-size: 32px;
          font-weight: 300;
        }

        .editButton {
          position: absolute;
          z-index: 5;
          right: 2px;
          bottom: 5px;
          width: 34px;
          height: 34px;
          border: 1px solid #3a404c;
          border-radius: 50%;
          background: #12151c;
          color: #ff9b4d;
          cursor: pointer;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.35);
          transition: transform 0.2s ease;
        }

        .editButton:hover {
          transform: scale(1.08);
        }

        .content {
          position: relative;
          z-index: 2;
          min-width: 0;
        }

        .label {
          color: #6e7cf6;
          font-size: 10px;
          letter-spacing: 0.17em;
        }

        .content h3 {
          margin: 7px 0 0;
          color: #f3f1ea;
          font-size: 19px;
          font-weight: 500;
        }

        .content p {
          max-width: 520px;
          margin: 8px 0 0;
          color: #858a94;
          font-size: 13px;
          line-height: 1.65;
        }

        .chooseButton {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          margin-top: 15px;
          padding: 11px 18px;
          border: 1px solid #343a46;
          border-radius: 999px;
          background: transparent;
          color: #f3f1ea;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition:
            border-color 0.2s ease,
            background 0.2s ease,
            transform 0.2s ease;
        }

        .chooseButton:hover {
          transform: translateY(-2px);
          border-color: rgba(255, 155, 77, 0.55);
          background: rgba(255, 155, 77, 0.05);
        }

        .chooseButton span {
          color: #ff9b4d;
          font-size: 15px;
        }

        .chooseButton:disabled,
        .editButton:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .message {
          margin-top: 10px;
          color: #ff9b4d;
          font-size: 12px;
        }

        @media (max-width: 600px) {
          .avatarBox {
            align-items: flex-start;
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}