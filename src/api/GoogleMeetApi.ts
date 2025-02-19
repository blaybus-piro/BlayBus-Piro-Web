import { apiRequest } from "../utils/api";

interface CreateMeetingParams {
  title: string;
  startTime: string; // ISO-8601 형식 (예: "2024-02-16T10:00:00")
  endTime: string;   // ISO-8601 형식 (예: "2024-02-16T11:00:00")
  designerName?: string;
}

interface MeetingResponse {
  title: string;
  hangoutLink: string;
}

interface ApiError {
  status?: number;
  message?: string;
}

/**
 * Google Meet 미팅 생성 API
 * @param params 미팅 생성에 필요한 파라미터
 * @returns 생성된 미팅 정보 (title, hangoutLink)
 */
export const createMeeting = async (params: CreateMeetingParams): Promise<MeetingResponse> => {
  try {
    const response = await apiRequest('/api/meetings/create', {
      method: 'POST',
      body: JSON.stringify(params),
    });

    if (!response || !response.hangoutLink) {
      throw new Error('미팅 링크 생성에 실패했습니다.');
    }

    return {
      title: response.title,
      hangoutLink: response.hangoutLink
    };
  } catch (error: unknown) {
    console.error('Google Meet 링크 생성 중 오류 발생:', error);

    const apiError = error as ApiError;

    // 에러 코드별 처리
    if (apiError.status === 400) {
      throw new Error('요청 데이터가 올바르지 않습니다.');
    } else if (apiError.status === 403) {
      throw new Error('권한이 없습니다. 로그인이 필요할 수 있습니다.');
    } else if (apiError.status === 404) {
      throw new Error('리소스를 찾을 수 없습니다.');
    } else if (apiError.status === 500) {
      throw new Error('서버 오류가 발생했습니다. Google Meet API 연결에 문제가 있을 수 있습니다.');
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error('알 수 없는 오류가 발생했습니다.');
  }
};

/**
 * 예약 정보로부터 Google Meet 미팅 생성
 * @param reservationTime 예약 시간 (ISO-8601 형식)
 * @param designerName 디자이너 이름
 * @param duration 미팅 지속 시간(분), 기본값 60분
 */
export const createMeetingFromReservation = async (
  reservationTime: string,
  designerName: string,
  duration: number = 60
): Promise<string> => {
  try {
    // 시작 시간을 Date 객체로 변환
    const startTime = new Date(reservationTime);

    // 종료 시간 계산 (시작 시간 + 지속 시간)
    const endTime = new Date(startTime.getTime() + duration * 60000);

    // ISO 형식으로 변환
    const startTimeISO = startTime.toISOString();
    const endTimeISO = endTime.toISOString();

    // 미팅 제목 생성
    const title = `${designerName}님과 상담 예약 - ${startTime.getMonth() + 1}월 ${startTime.getDate()}일 ${startTime.getHours()}시 ${startTime.getMinutes()}분`;

    const meetingData = await createMeeting({
      title,
      startTime: startTimeISO,
      endTime: endTimeISO,
      designerName
    });

    return meetingData.hangoutLink;
  } catch (error: unknown) {
    console.error('예약 정보로 미팅 생성 중 오류 발생:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('미팅 생성 중 알 수 없는 오류가 발생했습니다.');
  }
};