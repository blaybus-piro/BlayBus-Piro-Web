import { useEffect, useState } from "react";
import { apiRequest } from "../utils/api";

interface Designer {
    id: string;
    name: string;
    address: string;
    specialty: "CUL" | "PERM" | "DYE" | "BLEACH";
    profileImage: string;
    portfolioImages: string[];
    description: string;
    type: "ONLINE" | "OFFLINE" | "BOTH";
    remotePrice: number;
    inPersonPrice: number;
}

export const useDesignerDetail = (designerId?: string) => {
    const [designer, setDesigner] = useState<Designer | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!designerId) return;

        setLoading(true);
        apiRequest(`/api/designers/${designerId}`)
            .then((data) => {
                const formattedDesigner = {
                    id: data.id,
                    name: data.name,
                    profileImage: data.profile,
                    address: data.address,
                    specialty: data.expertField,
                    description: data.introduce,
                    portfolioImages: data.portfolio,
                    type: data.type,
                    inPersonPrice: data.offlinePrice,
                    remotePrice: data.onlinePrice
                };
                setDesigner(formattedDesigner);
                setLoading(false);
            })
            .catch((error) => {
                setError("디자이너 정보를 불러오는 데 실패했습니다.");
                setLoading(false);
                console.error(error);
            });
    }, [designerId]);

    return { designer, loading, error };
}