import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Divider,
} from "@chakra-ui/react";
import axios from "axios";

function FAQs() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFAQs = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/api/getFaqs");
        setFaqs(response.data);
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFAQs();
  }, []);
  return (
    <div className="px-8 py-10">
      <p className="text-heading2-bold py-2 text-sm">Order History</p>
      <Divider className="bg-grey-200 mt-4 mb-8" />
      <Accordion allowToggle>
        {faqs.map((faq) => (
          <AccordionItem key={faq._id}>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  {faq.question}
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>{faq.answer}</AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

export default FAQs;
