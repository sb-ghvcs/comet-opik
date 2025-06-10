import { CLOUD_PROVIDER_OPTION_TYPE, PROVIDERS } from "@/constants/providers";
import {
  PROVIDER_MODEL_TYPE,
  PROVIDER_MODELS_TYPE,
  PROVIDER_TYPE,
  ProviderKeyWithAPIKey,
} from "@/types/providers";
import useProviderKeys from "@/api/provider-keys/useProviderKeys";
import useAppStore from "@/store/AppStore";
import { useCallback, useMemo } from "react";
import isEmpty from "lodash/isEmpty";

const useVllmAIProviderData = () => {
  const workspaceName = useAppStore((state) => state.activeWorkspaceName);
  const { data } = useProviderKeys({
    workspaceName,
  });

  const getVllmAIProviderData = useCallback((provider: PROVIDER_TYPE) => {
    let retVal: ProviderKeyWithAPIKey | undefined = undefined;
    const config = PROVIDERS[provider] as CLOUD_PROVIDER_OPTION_TYPE;

    if (config) {
      const providerData = {};
      retVal = isEmpty(providerData) ? undefined : providerData;
    }

    return retVal;
  }, []);

  const getVllmServerModels = useCallback((baseUrl: string) => {
    const retVal: string[] = [];

    return retVal;
  }, []);

  const vllmModels = useMemo(() => {
    const retVal: Partial<PROVIDER_MODELS_TYPE> = {};

    console.log(data);
    if (data) {
      data.content.forEach((providerKey) => {
        if (providerKey.provider === PROVIDER_TYPE.VLLM) {
          const providerData = getVllmAIProviderData(providerKey.provider);
          console.log(providerData);
          if (providerData?.url) {
            const models = getVllmServerModels(providerData.url);
            retVal[providerKey.provider] = models.map((m) => ({
              value: m.trim() as PROVIDER_MODEL_TYPE,
              label: m.trim(),
            }));
          }
        }
      });
    }
    console.log(retVal);
    return retVal;
  }, [data, getVllmAIProviderData, getVllmServerModels]);

  return {
    vllmModels,
    getVllmAIProviderData,
  };
};

export default useVllmAIProviderData;
