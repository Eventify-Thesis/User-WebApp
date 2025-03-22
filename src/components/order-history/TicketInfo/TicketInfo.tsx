import React, { useEffect, useState } from "react";
import { Tag } from "antd";
import { CheckCircleOutlined, CalendarOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { FastAverageColor } from "fast-average-color";
import * as s from "./TicketInfo.styles";
import { countReset } from "console";

interface TicketInfoProps {
  date: Date;
  title: string;
  status: string;
  ticketType: string;
  time: string;
  location: string;
  imageUrl: string;
}

const TicketInfo: React.FC<TicketInfoProps> = ({ date, title, status, ticketType, time, location, imageUrl }) => {
  const [primaryColor, setPrimaryColor] = useState("#4a4a55"); // Default color

  useEffect(() => {
  if (!imageUrl) return;

  const fac = new FastAverageColor();
  const img = new Image();
  img.crossOrigin = "Anonymous";
  img.src = imageUrl;

  img.onload = async () => {
    try {
      const color = await fac.getColorAsync(img);
      setPrimaryColor(color.hex);
    } catch (error) {
      console.error("Error extracting color:", error);
    }
  };

  img.onerror = () => {
    console.error("Error loading image", imageUrl);
  };

  return () => {
    fac.destroy();
    img.onload = null;
    img.onerror = null;
  };
}, [imageUrl]);



  const isLightColor = (color: string) => {
    const rgb = color.match(/\d+/g)?.map(Number) || [0, 0, 0];
    const brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
    return brightness > 180;
  };

  const textColor = isLightColor(primaryColor) ? "#000" : "#fff";

  return (
    <s.TicketContainer $primaryColor={primaryColor}>
      <s.DateBox $primaryColor={primaryColor} $textColor={textColor}>
        <div>{date.getDate()}</div>
        <div>{date.toLocaleString("vi-VN", { month: "long" })}</div>
        <div>{date.getFullYear()}</div>
      </s.DateBox>
      <s.TicketInfoContainer $imageUrl={imageUrl} $primaryColor={primaryColor} $textColor={textColor}>
        <h3>{title}</h3>
        <s.TagsContainer>
          <Tag color="green">
            <CheckCircleOutlined /> {status}
          </Tag>
          <Tag color="blue">{ticketType}</Tag>
        </s.TagsContainer>
        <p>
          <CalendarOutlined /> {time}
        </p>
        <p>
          <EnvironmentOutlined /> {location}
        </p>
      </s.TicketInfoContainer>
    </s.TicketContainer>
  );
};

export default TicketInfo;
