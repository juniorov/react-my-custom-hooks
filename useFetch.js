import { useEffect, useState } from "react"

const localCache = {}

export const useFetch = (url) => {
    const initialValues = {
        data: null,
        isLoading: true,
        hasError: false,
        error: null,
    };
    const [state, setState] = useState(initialValues);

    useEffect(() => {
        getFetch();
    }, [url]);

    const setLoadingState = () => {
        setState(initialValues);
    }

    const getFetch = async() => {

        if(localCache[url]) {
            setState({
                ...initialValues,
                isLoading: false,
                data: localCache[url],
            })

            return;
        }

        setLoadingState();
        const response = await fetch(url);

        await new Promise(resolve => setTimeout(resolve, 500));

        if( !response.ok) {
            setState({
                data: null,
                isLoading: false,
                hasError: true,
                error: {
                    code: response.status,
                    message: response.statusText,
                }
            });
            return;
        }

        const data = await response.json();
        setState({
            ...initialValues,
            data: data,
            isLoading: false,
        });
        localCache[url] = data;
    }


    return {
        data: state.data,
        isLoading: state.isLoading,
        hasError: state.hasError,
    }
}
