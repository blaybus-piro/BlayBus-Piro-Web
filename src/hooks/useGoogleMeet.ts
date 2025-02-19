import { useState, useCallback } from 'react';
import { createMeeting, createMeetingFromReservation } from '../api/GoogleMeetApi';

interface UseGoogleMeetReturn {
  isLoading: boolean;
  error: Error | null;
  meetLink: string | null;
  createMeetingWithDetails: (
    title: string,
    startTime: string,
    endTime: string,
    designerName?: string
  ) => Promise<string>;
  createMeetingForReservation: (
    reservationTime: string,
    designerName: string,
    duration?: number
  ) => Promise<string>;
  resetError: () => void;
}

/**
 * 오류를 Error 객체로 변환하는 유틸리티 함수
 */
function toError(maybeError: unknown): Error {
  if (maybeError instanceof Error) return maybeError;
  
  try {
    return new Error(
      typeof maybeError === 'string'
        ? maybeError
        : JSON.stringify(maybeError)
    );
  } catch {
    // 직렬화할 수 없는 경우
    return new Error(String(maybeError));
  }
}

/**
 * Google Meet 링크 생성을 위한 커스텀 훅
 * @returns Google Meet 관련 상태와 함수들
 */
export const useGoogleMeet = (): UseGoogleMeetReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [meetLink, setMeetLink] = useState<string | null>(null);

  // 에러 초기화 함수
  const resetError = useCallback(() => {
    setError(null);
  }, []);

  // 상세 정보로 미팅 생성
  const createMeetingWithDetails = useCallback(async (
    title: string,
    startTime: string,
    endTime: string,
    designerName?: string
  ): Promise<string> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await createMeeting({
        title,
        startTime,
        endTime,
        designerName
      });
      
      setMeetLink(result.hangoutLink);
      return result.hangoutLink;
    } catch (err: unknown) {
      const errorObj = toError(err);
      setError(errorObj);
      throw errorObj;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 예약 정보로 미팅 생성
  const createMeetingForReservation = useCallback(async (
    reservationTime: string,
    designerName: string,
    duration: number = 60
  ): Promise<string> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const link = await createMeetingFromReservation(
        reservationTime,
        designerName,
        duration
      );
      
      setMeetLink(link);
      return link;
    } catch (err: unknown) {
      const errorObj = toError(err);
      setError(errorObj);
      throw errorObj;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    meetLink,
    createMeetingWithDetails,
    createMeetingForReservation,
    resetError
  };
};