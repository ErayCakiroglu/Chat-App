import { LoaderIcon } from "lucide-react";

// Sayfa yüklenirken gösterilen tam ekran yükleme bileşeni
function PageLoader() {
    return (
        <div className="flex items-center justify-center bg-black h-screen">
            <LoaderIcon className="size-12 animate-spin text-orange-50" />
        </div>
    );
}

export default PageLoader;