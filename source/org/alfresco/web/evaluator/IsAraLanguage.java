package org.alfresco.web.evaluator;

import org.alfresco.error.AlfrescoRuntimeException;
import org.json.simple.JSONObject;

import java.util.ArrayList;

public class IsAraLanguage extends BaseEvaluator {
    private ArrayList<String> aspects;

    public void setAspects(ArrayList<String> aspects) {
        this.aspects = aspects;
    }

    public boolean evaluate(JSONObject jsonObject) {
        try {

            JSONObject decoratedLocale = (JSONObject) this.getProperty(jsonObject, "sys:locale");
            if (decoratedLocale == null)
                return false;
            Object language = decoratedLocale.get("value");
            System.out.println(" - - - - - " + decoratedLocale);
            System.out.println(" - - - - - " + "arabic".equals(language));
            return "arabic".equals(language);
        } catch (Exception err) {
            throw new AlfrescoRuntimeException("Failed to run action IsPivotLanguage: " + err.getMessage());
        }

    }


}
