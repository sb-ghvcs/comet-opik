import {
  PROVIDER_MODEL_TYPE,
  PROVIDER_MODELS_TYPE,
  PROVIDER_TYPE,
  ProviderKey,
  ProviderKeyWithAPIKey,
} from "@/types/providers";
import useProviderKeys from "@/api/provider-keys/useProviderKeys";
import useAppStore from "@/store/AppStore";
import { useCallback, useMemo } from "react";

const useVllmAIProviderData = () => {
  const workspaceName = useAppStore((state) => state.activeWorkspaceName);
  const { data } = useProviderKeys({
    workspaceName,
  });

  const getVllmAIProviderData = useCallback(() => {
    let retVal: ProviderKeyWithAPIKey | undefined = undefined;
    if (data) {
      const vllmConfig = data.content.find(
        (providerKey) => providerKey.provider === PROVIDER_TYPE.VLLM,
      );

      if (vllmConfig) {
        // Not using spread, we don't need all the properties
        const _vllmConfig = vllmConfig as (ProviderKey & { base_url: string })
        retVal = {
          id: _vllmConfig.id,
          keyName: _vllmConfig.keyName,
          provider: _vllmConfig.provider,
          created_at: _vllmConfig.created_at,
          url: _vllmConfig.base_url,
          apiKey: "*****",
        };
      }
    }
    return retVal;
  }, [data]);

  const getVllmServerModels = useCallback((baseUrl: string) => {
    const retVal: string[] = [];

    return retVal;
  }, []);

  const vllmModels = useMemo(() => {
    const retVal: Partial<PROVIDER_MODELS_TYPE> = {};

    const providerData = getVllmAIProviderData();

    if (providerData?.url) {
      const models = getVllmServerModels(providerData.url);
      retVal[providerData.provider] = models.map((m) => ({
        value: m.trim() as PROVIDER_MODEL_TYPE,
        label: m.trim(),
      }));
    }

    console.log(retVal);
    return retVal;
  }, [getVllmAIProviderData, getVllmServerModels]);

  return {
    vllmModels,
    getVllmAIProviderData,
    getVllmServerModels,
  };
};

export default useVllmAIProviderData;
