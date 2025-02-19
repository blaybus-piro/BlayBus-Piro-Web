import { useEffect, useState } from "react";
import { apiRequest } from "../utils/api";

interface Designer {
    id: string;
    name: string;
    price: number;
    image: string;
    specialty: string;
    distance: number;
    type: string;
}

export const useDesignerList = (userLocation: { lat: number; lng: number } | null, sortBy: string, consultingType: string) => {
    const [originalDesigners, setOriginalDesigners] = useState<Designer[]>([]);
    const [designers, setDesigners] = useState<Designer[]>([]);

    useEffect(() => {
        if (!userLocation) return;

        const fetchDesigners = async () => {
            try {
                const response = await apiRequest(
                    `/api/designers/nearby?lat=${userLocation.lat}&lng=${userLocation.lng}`
                );

                // 응답이 배열인지 확인
                if (Array.isArray(response)) {
                    const formattedData = response.map((designer: any) => ({
                        id: designer.id,
                        name: designer.name,
                        price: Math.min(designer.offlinePrice, designer.onlinePrice),
                        image: designer.profile,
                        specialty: designer.expertField,
                        distance: designer.distance,
                        type: designer.type,
                    }));

                    setOriginalDesigners(formattedData);
                    setDesigners(formattedData);
                } else {
                    // 응답이 배열이 아닌 경우 처리
                    console.error('API 응답이 배열 형식이 아닙니다:', response);
                    setOriginalDesigners([]);
                    setDesigners([]);
                }
            } catch (error) {
                console.error('디자이너 목록을 불러오는 데 실패했습니다.', error);
                setOriginalDesigners([]);
                setDesigners([]);
            }
        };

        fetchDesigners();
    }, [userLocation]);

    useEffect(() => {
        if (originalDesigners.length === 0) return;

        let filtered = [...originalDesigners];

        if (consultingType) {
            filtered = filtered.filter(item => {
                if (consultingType === 'offline') {
                    return item.type === "OFFLINE" || item.type === "BOTH";
                } else if (consultingType === 'online') {
                    return item.type === "ONLINE" || item.type === "BOTH";
                }
                return true;
            });
        }

        if (sortBy === "price_asc") {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sortBy === "price_desc") {
            filtered.sort((a, b) => b.price - a.price);
        }

        setDesigners([...filtered]);
        console.log("정렬된 데이터: ", filtered);
    }, [sortBy, consultingType, originalDesigners]);

    return { designers };
}