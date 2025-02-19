import { useEffect, useState } from "react";

export const useUserLocation = () => {
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

    useEffect(() => {
        const fetchLocation = () => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error("위치 정보를 가져올 수 없습니다: ", error);
                }
            );
        };

        fetchLocation();
    }, []);

    return userLocation;
}