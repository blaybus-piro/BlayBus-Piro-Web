import React, { useState } from "react";
import Button from "./Button/Button";
import { createMeetingFromReservation } from "../api/GoogleMeetApi";

interface EnhancedMeetLinkButtonProps {
    children: React.ReactNode;
    meetLink?: string;
    reservationTime: string;
    designerName: string;
}

type ErrorWithMessage = {
    message: string;
};

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
    return (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof (error as Record<string, unknown>).message === 'string'
    );
}

function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
    if (isErrorWithMessage(maybeError)) return maybeError;
    
    try {
        return new Error(JSON.stringify(maybeError));
    } catch {
        // 직렬화 불가능한 경우
        return new Error(String(maybeError));
    }
}

function getErrorMessage(error: unknown): string {
    return toErrorWithMessage(error).message;
}

const EnhancedMeetLinkButton: React.FC<EnhancedMeetLinkButtonProps> = ({ 
    children, 
    meetLink, 
    reservationTime,
    designerName
}) => {
    const [localMeetLink, setLocalMeetLink] = useState<string | undefined>(meetLink);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleClick = async () => {
        // 이미 링크가 있으면 열기
        if (localMeetLink) {
            window.open(localMeetLink, "_blank");
            return;
        }

        // 링크가 없으면 새로 생성
        setIsGenerating(true);
        setError(null);

        try {
            const generatedLink = await createMeetingFromReservation(
                reservationTime,
                designerName,
                60 // 기본 1시간으로 설정
            );
            
            setLocalMeetLink(generatedLink);
            window.open(generatedLink, "_blank");
        } catch (err: unknown) {
            console.error("미팅 링크 생성 실패:", err);
            setError(getErrorMessage(err) || "미팅 링크 생성에 실패했습니다.");
        } finally {
            setIsGenerating(false);
        }
    };

    // 버튼 텍스트 결정
    const buttonText = isGenerating 
        ? "미팅 링크 생성 중..." 
        : localMeetLink 
            ? children 
            : "미팅 링크 생성하기";

    const isDisabled = isGenerating;

    return (
        <div className="meet-link-container">
            <Button
                variant="primary"
                onClick={handleClick}
                disabled={isDisabled}
            >
                {buttonText}
            </Button>
            
            {error && (
                <p className="meet-link-error" style={{ color: 'red', marginTop: '8px' }}>
                    {error}
                </p>
            )}
        </div>
    );
};

export default EnhancedMeetLinkButton;