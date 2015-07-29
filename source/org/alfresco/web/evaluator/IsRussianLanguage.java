package org.alfresco.web.evaluator;

import org.alfresco.error.AlfrescoRuntimeException;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import java.util.ArrayList;

public class IsRussianLanguage extends BaseEvaluator {
    private ArrayList<String> aspects;

    public void setAspects(ArrayList<String> aspects) {
        this.aspects = aspects;
    }

    public boolean evaluate(JSONObject jsonObject) {
        try {
            JSONObject decoratedLocale = (JSONObject) this.getProperty(jsonObject, "sys:locale");
            if (decoratedLocale == null)
                return false;
            Integer isMultiLin = ((JSONArray)((JSONObject)jsonObject.get("node")).get("aspects")).indexOf("cm:mlDocument");
            if(isMultiLin == -1)
                return false;

            Object language = decoratedLocale.get("value");
            return "ru".equals(language);
        } catch (Exception err) {
            throw new AlfrescoRuntimeException("Failed to run action IsPivotLanguage: " + err.getMessage());
        }

    }


}
