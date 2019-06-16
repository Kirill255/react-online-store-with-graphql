import React from "react";
import { Box, Text, Button, Modal, Spinner } from "gestalt";

import { calculatePrice } from "../utils";

const ConfirmationModal = ({ cartItems, orderProcessing, closeModal, handleSubmitOrder }) => (
  <Modal
    accessibilityModalLabel="Confirm Your Order"
    role="alertdialog"
    heading="Confirm Your Order"
    accessibilityCloseLabel="close"
    size="sm"
    onDismiss={closeModal}
    footer={
      <Box display="flex" justifyContent="center" marginLeft={-1} marginRight={-1}>
        <Box padding={1}>
          <Button text="Cancel" size="lg" disabled={orderProcessing} onClick={closeModal} />
        </Box>
        <Box padding={1}>
          <Button
            text="Submit"
            size="lg"
            color="red"
            disabled={orderProcessing}
            onClick={handleSubmitOrder}
          />
        </Box>
      </Box>
    }
  >
    {/* Order Summary */}
    {!orderProcessing && (
      <Box
        display="flex"
        direction="column"
        justifyContent="center"
        alignItems="center"
        padding={2}
        color="lightWash"
      >
        {cartItems.map((item) => (
          <Box key={item.id} padding={1}>
            <Text size="lg" color="red">
              {item.name} x {item.quantity} — $ {(item.quantity * item.price).toFixed(2)}
            </Text>
          </Box>
        ))}

        <Box paddingY={2}>
          <Text size="lg" bold>
            Total: {calculatePrice(cartItems)}
          </Text>
        </Box>
      </Box>
    )}

    {/* Order Processing Spinner */}
    <Spinner accessibilityLabel="Order Processing Spinner" show={orderProcessing} />
    {orderProcessing && (
      <Text align="center" italic>
        Submitting Order...
      </Text>
    )}
  </Modal>
);

export default ConfirmationModal;
